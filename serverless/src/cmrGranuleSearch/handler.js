import { pick } from 'lodash'
import { buildParams } from '../util/cmr/buildParams'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getJwtToken } from '../util/getJwtToken'
import { isWarmUp } from '../util/isWarmup'

/**
 * Perform an authenticated CMR Granule search
 * @param {Object} event Details about the HTTP request that it received
 */
const cmrGranuleSearch = async (event, context) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event, context)) return false

  const { body, headers } = event

  // The 'Accept' header contains the UMM version
  const providedHeaders = pick(headers, ['Accept'])

  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'bounding_box',
    'browse_only',
    'cloud_cover',
    'day_night_flag',
    'echo_collection_id',
    'exclude',
    'line',
    'online_only',
    'options',
    'page_num',
    'page_size',
    'point',
    'polygon',
    'readable_granule_name',
    'sort_key',
    'temporal',
    'two_d_coordinate_system'
  ]

  const nonIndexedKeys = [
    'exclude',
    'readable_granule_name',
    'sort_key'
  ]

  return doSearchRequest(
    getJwtToken(event),
    '/search/granules.json',
    buildParams({
      body,
      permittedCmrKeys,
      nonIndexedKeys
    }),
    providedHeaders
  )
}

export default cmrGranuleSearch