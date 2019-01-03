import config           from '../app/config/config'
import storeAuth        from '../app/auth/store'
import claimCore        from './claim-core'

const claim = claimCore.createClientClaim(storeAuth, config.SERVER.SERVER_API_ADDRESS)
export default claim