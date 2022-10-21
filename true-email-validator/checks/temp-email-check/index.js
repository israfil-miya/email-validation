import _ from 'underscore'
import _sourceDomains from './disposable-email-domains.json' assert { type: 'json' }

export const checkEmail = (email) => {
  if (!email) return false
  let _email = email.toLowerCase()
  let domain = _email.split('@')[1]
  if (_.contains(_sourceDomains, '' + domain)) return false
  else return true
}

export const findDomain = (domain) => {
  if (!domain) return false
  if (_.contains(_sourceDomains, '' + domain)) return true
  else return false
}

export const getSource = () => {
  return _sourceDomains
}
