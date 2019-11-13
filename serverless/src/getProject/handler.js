import { getDbConnection } from '../util/database/getDbConnection'
import { isWarmUp } from '../util/isWarmup'
import { deobfuscateId } from '../util/obfuscation/deobfuscateId'

/**
 * Retrieve a single project from the database
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const getProject = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event, context)) return false

  const { pathParameters } = event
  const {
    id: providedProjectId
  } = pathParameters

  const decodedProjectId = deobfuscateId(providedProjectId)

  // Retrive a connection to the database
  const dbConnection = await getDbConnection()

  try {
    const existingProjectRecord = await dbConnection('projects')
      .first('name', 'path')
      .where({
        id: decodedProjectId
      })

    if (existingProjectRecord && existingProjectRecord !== null) {
      // Return the name and path
      return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(existingProjectRecord)
      }
    }

    return {
      isBase64Encoded: false,
      statusCode: 404,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ errors: [`Project '${providedProjectId}' not found.`] })
    }
  } catch (error) {
    console.log(error)

    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ errors: [error] })
    }
  }
}

export default getProject