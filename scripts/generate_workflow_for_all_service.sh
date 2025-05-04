# read the workflow template
WORKFLOW_SERVICE_TEMPLATE=$(cat .github/templates/service-template.yml)

# iterate each route in routes directory
for SERVICE_NAME in $(ls services); do
    # skip if service name is shared
    if [ "${SERVICE_NAME}" = "shared" ]; then
        continue
    fi
    # skip if service name is not a directory
    if [ ! -d "services/${SERVICE_NAME}" ]; then
        continue
    fi
    # skip if service name is gateway
    if [ "${SERVICE_NAME}" = "gateway" ]; then
        continue
    fi

    # replace template service placeholder with service name
    echo "Generating workflow for service ${SERVICE_NAME}"

    # replace template route placeholder with route name
    WORKFLOW=$(echo "${WORKFLOW_SERVICE_TEMPLATE}" | sed "s/{{SERVICE_NAME}}/${SERVICE_NAME}/g")

    # save workflow to .github/workflows/{ROUTE}
    echo "${WORKFLOW}" > .github/workflows/${SERVICE_NAME}-service.yml
done