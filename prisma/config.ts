import { PrismaConfig } from '@prisma/config'

const prismaConfig: PrismaConfig = {
  earlyAccess: true,
  swr: true,
}

export default prismaConfig