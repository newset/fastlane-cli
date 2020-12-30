#!/bin/bash

changelog-parser CHANGELOG.md | jq '.versions[0] | "# " + .title + "\n" + .body | {markdown: {content: .}, "msgtype": "markdown"}' | curl --location --request POST $ROBOT_URL -H 'Content-Type: application/json' -d@-
