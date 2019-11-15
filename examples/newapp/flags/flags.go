package flags

import (
    "flag"
)

var IsDev = flag.Bool("dev", false, "Enable development mode")
var IsStage= flag.Bool("stage", false, "Enable stage mode")
var Drop = flag.Bool("drop", false, "Drop all db tables")
var Version = flag.Bool("version", false, "Print version")
var Port = flag.String("port", "none", "Set server port")
var Auth = flag.Bool("auth", false, "Disable authorisation")

var _ = ParseFlags()

func ParseFlags() error{
    flag.Parse()
    return nil
}

