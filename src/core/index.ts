import { Options } from "../type/core";
import Tracker from "./Tracker";
import { ErrorCatcher }  from './ErrorTracker'
import { actionCatcher } from './DomTracker'

export function init(options: Options) {
  new Tracker(options)
}

export { ErrorCatcher, actionCatcher }