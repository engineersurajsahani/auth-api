const jwt=require('jsonwebtoken');

const authMiddleware=(request,response,next)=>{
    const token=request.headers['token'];
    if(!token){
        return response.status(401).json({message:'Access denied'});
    }

    const decodedToken=jwt.verify(token,'mernstack');
    if(!decodedToken){
        return response.status(401).json({message:'Invalid token'});
    }

    request.user=decodedToken;
    next();
}

module.exports=authMiddleware;