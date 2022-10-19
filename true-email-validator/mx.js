import legit from 'legit'

const mxrecord = async (email) => {
    let allInfo = await legit(email)
    console.log(allInfo.mxArray)
    return allInfo.isValid
}

export default mxrecord