'use client'

import { library, IconDefinition } from '@fortawesome/fontawesome-svg-core'
import * as solid from '@fortawesome/pro-solid-svg-icons'
import * as light from '@fortawesome/pro-light-svg-icons'

function onlyIcons(pack: Record<string, any>) {
  return Object.values(pack).filter(
    (i): i is IconDefinition => i?.iconName
  )
}

library.add(
  ...onlyIcons(solid),
  ...onlyIcons(light)
)
