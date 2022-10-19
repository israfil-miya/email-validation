import emailSMTPVerificator from 'email-smtp-verificator'
 
const verify = emailSMTPVerificator({ timeout: 12000 });


const smtp = async (email) => {
    let allInfo = await verify(email)
    return allInfo.verified
}

export default smtp