package cmd

import "gosha/mode"

type TypeConfig struct {
	IsId bool
}

var usualTypesAuthenticator = `package types

import (
    "{ms-name}/core"
    "{ms-name}/dbmodels"
    "{ms-name}/flags"
    "{ms-name}/settings"
    "{ms-name}/common"
    "net/http"
    "strings"
)

type Access struct {
	Find bool
	Read bool
	Create bool
	Update bool
	Delete bool
	FindOrCreate bool
	UpdateOrCreate bool
}

type Authenticator struct {
    Token        string
    functionType string
    urlPath      string
    userId       {ID}
    roleIds      []{ID}
    validator
}

func (auth *Authenticator) GetCurrentUserId() {ID} {
    return auth.userId
}

func (auth *Authenticator) SetCurrentUserId(id {ID}) {
    auth.userId = id
}

func (auth *Authenticator) GetCurrentUserRoleIds() []{ID} {
    return auth.roleIds
}

func (auth *Authenticator) IsCurrentUserAdmin() bool {
    return common.InArray(settings.AdminRoleId, auth.roleIds)
}

func (auth *Authenticator) IsAuthorized() bool {

    if *flags.Auth {
        return true
    }

    if len(auth.Token) < 1 {
        return false
    }

    dbAuth := dbmodels.Auth{}
    core.Db.Where(dbmodels.Auth{Token: auth.Token}).First(&dbAuth)

    if dbAuth.IsActive {

        if dbAuth.UserId {GetIdIsNotValidExp} {
            return false
        }

        auth.SetCurrentUserId(dbAuth.UserId)

        userRoles := []dbmodels.UserRole{}
        core.Db.Where(dbmodels.UserRole{UserId: dbAuth.UserId}).Find(&userRoles)

        for _, ur := range userRoles {
            auth.roleIds = append(auth.roleIds, ur.RoleId)
        }

        usedResources := []dbmodels.Resource{}

        core.Db.Where(dbmodels.Resource{
            Code:   clearPath(auth.urlPath),
            TypeId: settings.HttpRouteResourceType` + GetConfigConverter(mode.GetUuidMode()) + `,
        }).Find(&usedResources)

        if len(usedResources) < 1 {
            return false
        }

        ids := []{ID}{}

        for _, r := range usedResources {
            ids = append(ids, r.ID)
        }

        roleResources := []dbmodels.RoleResource{}

        core.Db.Model(dbmodels.RoleResource{}).
            Where("role_id in (select role_id from user_roles where deleted_at IS NULL and user_id = ?) and resource_id in (?)", dbAuth.UserId, ids).Find(&roleResources)

        switch auth.functionType {
        case settings.FunctionTypeFind:
            for _, rr := range roleResources {
                if rr.Find {
                    return true
                }
            }
            return false

        case settings.FunctionTypeRead:
            for _, rr := range roleResources {
                if rr.Read {
                    return true
                }
            }
            return false

        case settings.FunctionTypeCreate, settings.FunctionTypeMultiCreate:
            for _, rr := range roleResources {
                if rr.Create {
                    return true
                }
            }
            return false

        case settings.FunctionTypeUpdate, settings.FunctionTypeMultiUpdate:
            for _, rr := range roleResources {
                if rr.Update {
                    return true
                }
            }
            return false

        case settings.FunctionTypeDelete, settings.FunctionTypeMultiDelete:
            for _, rr := range roleResources {
                if rr.Delete {
                    return true
                }
            }
            return false

        case settings.FunctionTypeFindOrCreate:
            for _, rr := range roleResources {
                if rr.FindOrCreate {
                    return true
                }
            }
            return false

        case settings.FunctionTypeUpdateOrCreate:
            for _, rr := range roleResources {
                if rr.UpdateOrCreate {
                    return true
                }
            }
            return false
        }
    }

    return false
}

func clearPath(s string) string {
    if strings.Count(s, "/") > 3 {
        return s[0:strings.LastIndex(s, "/")]
    }

    return s
}

func (auth *Authenticator) SetToken(r *http.Request) error {

    auth.Token = r.Header.Get("Token")

    return nil
}

func (authenticator *Authenticator) Validate(functionType string) {

    switch functionType {

    case settings.FunctionTypeFind:
        break;
    case settings.FunctionTypeCreate:
        break;
    case settings.FunctionTypeRead:
        break;
    case settings.FunctionTypeUpdate:
        break;
    case settings.FunctionTypeDelete:
        break;
    case settings.FunctionTypeMultiCreate:
        break
    case settings.FunctionTypeMultiUpdate:
        break
    case settings.FunctionTypeMultiDelete:
        break
    default:
        authenticator.validator.validationErrors = append(authenticator.validator.validationErrors, "Unsupported function type: "+functionType)
        break;
    }
}
`

var usualTypesEntity = `package types

import (
    "time"
)
// default entity will used when create new entity
type Entity struct {
    ID        int       ` + "`" + `gorm:"primary_key"` + "`" + `
    ` + getRemoveLine("Entity") + `

    CreatedAt time.Time
    UpdatedAt time.Time
    DeletedAt *time.Time ` + "`" + `sql:"index" json:"-"` + "`" + `

    validator
}

func (entity *Entity) Validate()  {
    ` + getRemoveLine("Validate") + `
}
`

const usualTypesFilter = `package types

import (
    "errors"
    "{ms-name}/settings"
    "net/http"
    "strings"
    "strconv"
    "github.com/gorilla/mux"
    "github.com/jinzhu/gorm"
    "net/url"
)

type FilterIds struct {
    Ids []{ID}
    ExceptIds []{ID}
    CurrentId {ID}

    validator
}

func (filter *FilterIds) GetFirstId() ({ID}, error) {
    for _, id := range filter.Ids {
        return id, nil
    }
    return {PkNil}, errors.New("Empty array")
}

func (filter *FilterIds) GetIds() []{ID} {
    return filter.Ids
}

func (filter *FilterIds) GetExceptIds() []{ID} {
    return filter.ExceptIds
}

func (filter *FilterIds) GetCurrentId() {ID} {
    return filter.CurrentId
}

func (filter *FilterIds) SetCurrentId(id {ID}) {ID} {
    filter.CurrentId = id
	return filter.CurrentId
}


func (filter *FilterIds) AddId(id {ID}) *FilterIds {
    filter.Ids = append(filter.Ids, id)
    return filter
}

func (filter *FilterIds) AddExceptId(id {ID}) *FilterIds {
    filter.ExceptIds = append(filter.ExceptIds, id)
    return filter
}

func (filter *FilterIds) AddIds(ids []{ID}) *FilterIds {
    for _, id := range ids {
        filter.AddId(id)
    }
    return filter
}

func (filter *FilterIds) AddExceptIds(ids []{ID}) *FilterIds {
    for _, id := range ids {
        filter.AddExceptId(id)
    }
    return filter
}

func (filter *FilterIds) ClearIds() *FilterIds {

    filter.Ids = []{ID}{}
    return filter
}

func (filter *FilterIds) ClearExceptIds() *FilterIds {

    filter.ExceptIds = []{ID}{}
    return filter
}

// method find read create update delete
func (filter *FilterIds) Validate(functionType string) {

    switch functionType {
        case settings.FunctionTypeFind:
            break;
        case settings.FunctionTypeCreate:
            break;
        case settings.FunctionTypeRead:
            break;
        case settings.FunctionTypeUpdate:
            break;
        case settings.FunctionTypeDelete:
            break;
        case settings.FunctionTypeFindOrCreate:
            break;
        case settings.FunctionTypeUpdateOrCreate:
            break;
        case settings.FunctionTypeMultiCreate:
            break;
        case settings.FunctionTypeMultiUpdate:
            break;
        case settings.FunctionTypeMultiDelete:
            break;
        default:
            filter.validator.validationErrors = append(filter.validator.validationErrors, "Usupported method")
            break;
    }
}


type GoshaSearchFilter struct {

    Search string
    SearchBy []string
}

type GoshaOrderFilter struct {

    Order []string
    OrderDirection []string
}

type AbstractFilter struct {

    request *http.Request
    GoshaSearchFilter
    GoshaOrderFilter
    FilterIds
    Pagination
    validator
    Authenticator
}

func GetAbstractFilter(request *http.Request, functionType string) AbstractFilter {

    var filter AbstractFilter

    filter.request = request
    filter.functionType = functionType
    filter.urlPath = request.URL.Path

    ReadJSON(filter.request, &filter)
    ReadJSON(filter.request, &filter.FilterIds)

    filter.Pagination.CurrentPage, _ = strconv.Atoi(request.FormValue("CurrentPage"))
    filter.Pagination.PerPage, _ = strconv.Atoi(request.FormValue("PerPage"))
    filter.Search = request.FormValue("Search")

    arr, _ := url.ParseQuery(request.URL.RawQuery)

    dirs := []string{}

    for _, dir := range arr["OrderDirection[]"] {

        if strings.ToLower(dir) == "desc" {
            dirs = append(dirs, "desc")
        } else {
            dirs = append(dirs, "asc")
        }
    }

    for index, field := range arr["Order[]"] {

        filter.Order = append(filter.Order, gorm.ToColumnName(field))

        if len(dirs) > index && dirs[index] == "desc" {
            filter.OrderDirection = append(filter.OrderDirection, "desc")
        } else {
            filter.OrderDirection = append(filter.OrderDirection, "asc")
        }
    }

    for _, field := range arr["SearchBy[]"] {
        filter.SearchBy = append(filter.SearchBy, gorm.ToColumnName(field))
    }
    for _, s := range arr["Ids[]"] {
        id, _ := {STRTOID}(s)
        filter.AddId(id)
    }

    for _, s := range arr["ExceptIds[]"] {
        id, _ := {STRTOID}(s)
        filter.AddExceptId(id)
    }

    filter.SetToken(request)

    ReadJSON(filter.request, &filter.validator)

    vars := mux.Vars(request)
    id, _ := {STRTOID}(vars["id"])

    if id {GetIdIsValidExp} {
        filter.SetCurrentId(id)
    }

    filter.Validate(functionType)

    return filter
}

func (filter *AbstractFilter) IsValid() bool  {

    return  filter.FilterIds.IsValid() &&
        filter.Pagination.IsValid() &&
        filter.validator.IsValid() &&
        filter.Authenticator.IsValid()
}

func (filter *AbstractFilter) Validate(functionType string)  {

    filter.FilterIds.Validate(functionType)
    filter.Pagination.Validate(functionType)
    filter.validator.Validate(functionType)
    filter.Authenticator.Validate(functionType)
}

func (filter *AbstractFilter) GetValidationErrors() string  {

    return strings.Join([]string{
        filter.FilterIds.GetValidationErrors(),
        filter.Pagination.GetValidationErrors(),
        filter.validator.GetValidationErrors(),
        filter.Authenticator.GetValidationErrors(),
    }, ". ")
}
`

const usualTypesRequest = `package types

import (
    "encoding/json"
    "net/http"
)

// ReadJSON -
func ReadJSON(r *http.Request, entity interface{}) (err error) {

    decoder := json.NewDecoder(r.Body)
    err = decoder.Decode(entity)
	if err == io.EOF {
		err = nil
	}

    defer r.Body.Close()
}
`

const usualTypesValidator = `package types

import (
    "strings"
    "{ms-name}/settings"
)

type validator struct {
    validationErrors	[]string
}

func (val *validator) IsValid() bool {

    return len(val.validationErrors) < 1
}

func (val *validator) GetValidationErrors() string {

    return strings.Join(val.validationErrors, ". ")
}

func (val *validator) Validate(functionType string) {

    switch functionType {

    case settings.FunctionTypeFind:
        break

    case settings.FunctionTypeCreate:
        break

    case settings.FunctionTypeMultiCreate:
        break

    case settings.FunctionTypeRead:
        break

    case settings.FunctionTypeUpdate:
        break

    case settings.FunctionTypeMultiUpdate:
        break

    case settings.FunctionTypeDelete:
        break

    case settings.FunctionTypeMultiDelete:
        break

    default:
        val.validationErrors = append(val.validationErrors, "Usupported function type: " + functionType)
        break
    }
}

`

const usualTypesResponse = `package types

import (
	"{ms-name}/settings"
)

type APIStatus struct {
	Status string
}

type APIError struct {
	Error bool
	ErrorMessage string
}

type Pagination struct {

	CurrentPage		int
	PerPage			int

	validator
}

func (pagination *Pagination) GetOffset() int {
	return (pagination.CurrentPage - 1) * pagination.PerPage
}

func (pagination *Pagination) Validate(functionType string) {

	switch functionType {

	case settings.FunctionTypeFind:

		if pagination.CurrentPage < 1 {
			pagination.validator.validationErrors = append(pagination.validator.validationErrors, "CurrentPage parameter is not set")
		}

		if pagination.PerPage < 1 {
			pagination.validator.validationErrors = append(pagination.validator.validationErrors, "PerPage parameter is not set")
		}

		break
    case settings.FunctionTypeCreate:
		break
	case settings.FunctionTypeMultiCreate:
		break
	case settings.FunctionTypeRead:
		break
	case settings.FunctionTypeUpdate:
		break
	case settings.FunctionTypeMultiUpdate:
		break
	case settings.FunctionTypeDelete:
		break
	case settings.FunctionTypeMultiDelete:
		break

	default:
		pagination.validator.validationErrors = append(pagination.validator.validationErrors, "Usupported function type: " + functionType)
		break
	}
}
`

func getUsualTemplateTypesAuthenticator(isUuidAsPk bool) template {

	cont := AssignVar(
		assignMsName(usualTypesAuthenticator),
		"{ID}",
		GetPKType(isUuidAsPk),
	)

	cont = AssignVar(
		cont,
		"{GetIdIsNotValidExp}",
		GetIdIsNotValidExp(isUuidAsPk),
	)

	usualTemplateTypesAuthenticator := template{
		Path:    "./types/authenticator.go",
		Content: cont,
	}
	return usualTemplateTypesAuthenticator
}

var usualTemplateTypesEntity = template{
	Path:    "./types/entity.go",
	Content: usualTypesEntity,
}

func getUsualTemplateTypesFilter(isUuidAsPk bool) template {

	tpl := AssignVar(
		assignMsName(usualTypesFilter),
		"{ID}",
		GetPKType(isUuidAsPk),
	)

	tpl = AssignVar(
		tpl,
		"{STRTOID}",
		GetStrToIdFuncName(isUuidAsPk),
	)

	tpl = AssignVar(
		tpl,
		"{PkNil}",
		GetIdNil(isUuidAsPk),
	)

	tpl = AssignVar(
		tpl,
		"{GetIdIsValidExp}",
		GetIdIsValidExp(isUuidAsPk),
	)

	usualTemplateTypesFilter := template{
		Path:    "./types/filter.go",
		Content: tpl,
	}

	return usualTemplateTypesFilter
}

var usualTemplateTypesRequest = template{
	Path:    "./types/request.go",
	Content: usualTypesRequest,
}

var usualTemplateTypesResponse = template{
	Path:    "./types/response.go",
	Content: assignMsName(usualTypesResponse),
}

var usualTemplateTypesValidator = template{
	Path:    "./types/validator.go",
	Content: assignMsName(usualTypesValidator),
}
