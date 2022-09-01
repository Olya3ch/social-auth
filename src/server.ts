import express, { Application, Request, Response } from 'express'

const app: Application = express()

const port: number = 3001

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world')
})

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`App is listening on port ${port} !`)
})