verifyLogin=(req,res,next)=>{
    let admin=req.session.admin
    if(admin)
    {
      next()
    }else{
      res.redirect('/admin/login')
    }
  }

  module.exports={
    verifyLogin
  }
  