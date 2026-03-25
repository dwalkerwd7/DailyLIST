import { loadEnv } from 'vite'

const env = loadEnv(import.meta.env.MODE, process.cwd(), '')
const appBasePath = env.VITE_APP_BASE_PATH || '/'

const APIPaths = {
    todos: `${appBasePath}/api/todos`
}

export default APIPaths;