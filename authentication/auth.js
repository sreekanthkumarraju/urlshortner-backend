const bcrypt=require('bcrypt')

let rounds=10
const hashPassword=async (password)=>{
    let salt=await bcrypt.genSalt(rounds)
    let hash=await bcrypt.hash(password,salt)
  
    return hash
}

module.exports={ hashPassword }