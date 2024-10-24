import jwt from 'jsonwebtoken';

export const generateToken = (userID:string, userRole?:string): string => {

  return jwt.sign(
    {
      id: userID,
      role: userRole || 'member'
    },
    process.env.SECRET_KEY as string,
    {
      expiresIn: 86400
    }
  )
}
