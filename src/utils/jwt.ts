import jwt from 'jsonwebtoken';

export const generateToken = (userID:string): string => {

  return jwt.sign(
    {
      id: userID,
    },
    process.env.SECRET_KEY as string,
    {
      expiresIn: 86400
    }
  )
}
