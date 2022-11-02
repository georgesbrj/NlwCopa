import Fastify from "fastify";
import {PrismaClient} from '@prisma/client'
import cors from '@fastify/cors';
import {z} from 'zod';
import ShortUniqueId from 'short-unique-id';

const prisma = new PrismaClient({
    log: ['query'],
})


async function bootstrap(){
    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors,{
        origin: true,
    })

    //acount pools 
    fastify.get('/pools/count',async ()=>{

    const count  = await prisma.pool.count()
        
    return {count}

    })

    //acount users
    fastify.get('/users/count',async ()=>{

        const users  = await prisma.user.count()
            
        return {users}
    
        })

    //acount guesses
    fastify.get('/guesses/count',async ()=>{

        const guesses  = await prisma.guess.count()
            
        return {guesses}
    
        })
    


    //route create pools
    fastify.post('/pools',async (request,reply)=>{

        const createPoolBody = z.object({
            title: z.string(),
        })    
    

        const {title } = createPoolBody.parse(request.body);

        const generate = new ShortUniqueId({length:6})

        const code =  String(generate()).toUpperCase()

         await  prisma.pool.create({
             data:{
                title,
                code
             }
         })

        return reply.status(201).send({code});
    
        })


    //response server    
    await fastify.listen({port:3333,/*host:'0.0.0.0'*/})

}

bootstrap()