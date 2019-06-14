package cmd

type Crud struct {
    IsFind bool
    IsCreate bool
    IsRead bool
    IsUpdate bool
    IsDelete bool
    IsFindOrCreate bool
}

const usualRouteEntityComment = `[ {Entity} ]`

const usualRouteEntityFind = `    router.HandleFunc("/api/v1/{entity}",           webapp.{Entity}Find).Methods("GET")`
const usualRouteEntityCreate = `    router.HandleFunc("/api/v1/{entity}",           webapp.{Entity}Create).Methods("POST")`
const usualRouteEntityRead = `    router.HandleFunc("/api/v1/{entity}/{id}",      webapp.{Entity}Read).Methods("GET")`
const usualRouteEntityUpdate = `    router.HandleFunc("/api/v1/{entity}/{id}",      webapp.{Entity}Update).Methods("PUT")`
const usualRouteEntityDelete = `    router.HandleFunc("/api/v1/{entity}/{id}",      webapp.{Entity}Delete).Methods("DELETE")`
const usualRouteEntityFindOrCreate = `    router.HandleFunc("/api/v1/{entity}",      webapp.{Entity}FindOrCreate).Methods("PUT")`

const usualRouteEntityGen = `

    //router-generator here dont touch this line`

var usualTemplateRouteEntity = template{
    Path:    "./path_error.txt",
    Content: GetUsualTemplateRouteEntity(Crud{true,true,true,true,true, true}),
}

func GetUsualTemplateRouteEntity(c Crud) (res string) {

    res = usualRouteEntityComment

    if c.IsFind {
        res += "\n" + usualRouteEntityFind
    }

    if c.IsCreate {
        res += "\n" + usualRouteEntityCreate
    }

    if c.IsRead {
        res += "\n" + usualRouteEntityRead
    }

    if c.IsUpdate {
        res += "\n" + usualRouteEntityUpdate
    }

    if c.IsDelete {
        res += "\n" + usualRouteEntityDelete
    }

    if c.IsFindOrCreate {
        res += "\n" + usualRouteEntityFindOrCreate
    }

    res += usualRouteEntityGen

    return res
}