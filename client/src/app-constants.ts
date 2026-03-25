const AppBasePath: string = import.meta.env.VITE_APP_BASE_PATH || '/'
const APIPaths = {
    todos: `${AppBasePath}/api/todos`
}

export { AppBasePath, APIPaths };