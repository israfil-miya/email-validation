import legit from 'legit'

const mxrecord = async (email) => {
    let allInfo = await legit(email)
    return allInfo.isValid
}

export default mxrecord