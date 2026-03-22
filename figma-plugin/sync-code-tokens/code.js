/**
 * Jeff Portfolio — sync Figma variables from design/figma-variables.json
 * (DTCG-style: groups → keys → { $type, $value }).
 */

var COLLECTION_NAME = 'Jeff Portfolio — Code'

/**
 * @param {string} hex
 * @returns {{ r: number, g: number, b: number, a: number } | null}
 */
function hexToFigmaColor(hex) {
  if (typeof hex !== 'string') return null
  var s = hex.trim()
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s)) return null
  s = s.slice(1)
  if (s.length === 3) {
    s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2]
  }
  var num = parseInt(s, 16)
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
    a: 1,
  }
}

/**
 * @param {string} group
 * @param {string} value
 * @returns {'COLOR' | 'STRING'}
 */
function resolvedTypeForToken(group, value) {
  if (group === 'color') return 'COLOR'
  if (hexToFigmaColor(value)) return 'COLOR'
  return 'STRING'
}

/**
 * @param {'COLOR' | 'STRING'} type
 * @param {string} value
 */
function coerceValue(type, value) {
  if (type === 'COLOR') {
    var c = hexToFigmaColor(value)
    if (!c) throw new Error('Invalid color: ' + value)
    return c
  }
  return String(value)
}

/**
 * With manifest `documentAccess: "dynamic-page"`, variable *listing* APIs must be async.
 * @param {Record<string, Record<string, { $type?: string, $value: string }>>} data
 * @returns {Promise<{ created: number, updated: number, errors: string[] }>}
 */
async function applyTokensAsync(data) {
  var collections = await figma.variables.getLocalVariableCollectionsAsync()
  var coll = collections.find(function (c) {
    return c.name === COLLECTION_NAME
  })
  if (!coll) {
    coll = figma.variables.createVariableCollection(COLLECTION_NAME)
  }
  var modeId = coll.modes[0].modeId
  var allVars = await figma.variables.getLocalVariablesAsync()
  var created = 0
  var updated = 0
  var errors = []

  for (var group in data) {
    if (!Object.prototype.hasOwnProperty.call(data, group)) continue
    var entries = data[group]
    if (!entries || typeof entries !== 'object') continue

    for (var key in entries) {
      if (!Object.prototype.hasOwnProperty.call(entries, key)) continue
      var entry = entries[key]
      if (!entry || typeof entry !== 'object' || entry.$value === undefined) {
        errors.push(group + '/' + key + ': missing $value')
        continue
      }
      var rawVal = String(entry.$value)
      var type = resolvedTypeForToken(group, rawVal)
      var fullName = group + '/' + key
      var existing = allVars.find(function (v) {
        return v.variableCollectionId === coll.id && v.name === fullName
      })

      if (existing && existing.resolvedType !== type) {
        existing.remove()
        existing = undefined
        allVars = await figma.variables.getLocalVariablesAsync()
      }

      var figmaVal = null
      try {
        figmaVal = coerceValue(type, rawVal)
      } catch (e) {
        errors.push(fullName + ': ' + (e && e.message ? e.message : String(e)))
        continue
      }

      if (existing) {
        existing.setValueForMode(modeId, figmaVal)
        updated++
      } else {
        var v = figma.variables.createVariable(fullName, coll, type)
        v.setValueForMode(modeId, figmaVal)
        created++
        allVars = await figma.variables.getLocalVariablesAsync()
      }
    }
  }

  return {
    created: created,
    updated: updated,
    errors: errors,
  }
}

figma.showUI(__html__, { width: 420, height: 520, themeColors: true })

figma.ui.onmessage = function (msg) {
  if (msg.type === 'cancel') {
    figma.closePlugin()
    return
  }
  if (msg.type !== 'apply') return

  var raw = msg.raw
  var data
  try {
    data = JSON.parse(raw)
  } catch (e) {
    figma.ui.postMessage({
      type: 'result',
      error: true,
      text: 'Invalid JSON: ' + (e && e.message ? e.message : String(e)),
    })
    return
  }

  applyTokensAsync(data)
    .then(function (r) {
      var lines = [
        'Done. Created: ' + r.created + ', updated: ' + r.updated + '.',
        r.errors.length ? '\nWarnings:\n' + r.errors.join('\n') : '',
      ].join('')
      figma.ui.postMessage({ type: 'result', error: r.errors.length > 0, text: lines })
      figma.notify('Variables synced (' + (r.created + r.updated) + ' total changes)')
    })
    .catch(function (e) {
      figma.ui.postMessage({
        type: 'result',
        error: true,
        text: 'Error: ' + (e && e.message ? e.message : String(e)),
      })
    })
}
