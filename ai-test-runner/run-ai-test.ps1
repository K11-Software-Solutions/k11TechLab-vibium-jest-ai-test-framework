param(
    [Parameter(Mandatory = $true)]
    [string]$PageObject,

    [Parameter(Mandatory = $true)]
    [string]$Goal,

    [string]$Type = "functional"
)

npm run ai:generate:test -- --page-object $PageObject --goal $Goal --type $Type --run
