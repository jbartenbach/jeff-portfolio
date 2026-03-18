import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import admin from 'firebase-admin'

function required(name) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env var ${name}`)
  return v
}

function loadServiceAccount(filePath) {
  const abs = path.resolve(filePath)
  const raw = fs.readFileSync(abs, 'utf8')
  return JSON.parse(raw)
}

function initApp(name, serviceAccountPath) {
  const cred = admin.credential.cert(loadServiceAccount(serviceAccountPath))
  return admin.initializeApp({ credential: cred }, name)
}

function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

async function main() {
  const sourceKey = required('SOURCE_SERVICE_ACCOUNT_JSON')
  const targetKey = required('TARGET_SERVICE_ACCOUNT_JSON')
  const adminEmail = required('ADMIN_EMAIL').toLowerCase()

  const sourceApp = initApp('source', sourceKey)
  const targetApp = initApp('target', targetKey)

  const sourceAuth = sourceApp.auth()
  const targetAuth = targetApp.auth()
  const sourceDb = sourceApp.firestore()
  const targetDb = targetApp.firestore()

  const sourceUser = await sourceAuth.getUserByEmail(adminEmail)
  const targetUser = await targetAuth.getUserByEmail(adminEmail)

  const sourceUid = sourceUser.uid
  const targetUid = targetUser.uid

  console.log(`Admin email: ${adminEmail}`)
  console.log(`Source UID: ${sourceUid}`)
  console.log(`Target UID: ${targetUid}`)

  const dryRun = (process.env.DRY_RUN ?? 'true') !== 'false'
  console.log(`DRY_RUN: ${dryRun}`)

  // Fetch source projects + tasks owned by sourceUid
  const projectsSnap = await sourceDb.collection('projects').where('ownerUid', '==', sourceUid).get()
  const tasksSnap = await sourceDb.collection('tasks').where('ownerUid', '==', sourceUid).get()

  const projects = projectsSnap.docs.map((d) => ({ id: d.id, data: d.data() }))
  const tasks = tasksSnap.docs.map((d) => ({ id: d.id, data: d.data() }))

  console.log(`Found projects: ${projects.length}`)
  console.log(`Found tasks: ${tasks.length}`)

  // Map old project IDs to new project IDs (since Firestore doc ids differ between projects)
  const projectIdMap = new Map()

  if (dryRun) {
    console.log('Dry run complete. Set DRY_RUN=false to write.')
    process.exit(0)
  }

  // Write projects first (new ids), keep createdAt if present
  for (const p of projects) {
    const ref = targetDb.collection('projects').doc()
    projectIdMap.set(p.id, ref.id)
    await ref.set({
      ...p.data,
      ownerUid: targetUid,
    })
  }

  // Write tasks, remapping projectId and ownerUid
  const taskWrites = tasks.map((t) => {
    const oldProjectId = t.data.projectId
    const newProjectId = projectIdMap.get(oldProjectId)
    if (!newProjectId) {
      throw new Error(`Task ${t.id} refers to unknown projectId ${oldProjectId}`)
    }
    const ref = targetDb.collection('tasks').doc()
    return { ref, data: { ...t.data, ownerUid: targetUid, projectId: newProjectId } }
  })

  // Batch in groups of 400 (Firestore limit is 500 ops/batch)
  for (const group of chunk(taskWrites, 400)) {
    const batch = targetDb.batch()
    for (const w of group) batch.set(w.ref, w.data)
    await batch.commit()
  }

  console.log('Migration complete.')
  console.log('Next: update .env / Netlify env vars with the NEW Firebase web config.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

