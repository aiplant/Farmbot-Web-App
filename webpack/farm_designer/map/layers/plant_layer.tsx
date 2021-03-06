import * as React from "react";
import { Link } from "react-router";
import * as _ from "lodash";
import { GardenPlant } from "../garden_plant";
import { PlantLayerProps, CropSpreadDict } from "../interfaces";
import { defensiveClone } from "../../../util";
import { history } from "../../../history";

const cropSpreadDict: CropSpreadDict = {};

export function PlantLayer(props: PlantLayerProps) {
  const {
    crops,
    plants,
    dispatch,
    visible,
    currentPlant,
    dragging,
    editing,
    mapTransformProps
  } = props;

  crops
    .filter(c => !!c.body.spread)
    .map(c => cropSpreadDict[c.body.slug] = c.body.spread);

  const pathName = history.getCurrentLocation().pathname;
  const clickToAddMode = pathName.split("/")[6] == "add";
  const selectMode = pathName.split("/")[4] == "select";
  const maybeNoPointer = (clickToAddMode || selectMode)
    ? { "pointerEvents": "none" } : {};

  return <g id="plant-layer">
    {visible &&
      plants
        .filter(x => !!x.body.id)
        .map(p => defensiveClone(p))
        .map(p => {
          return p;
        })
        .map(p => {
          return {
            selected: !!(currentPlant && (p.uuid === currentPlant.uuid)),
            plantId: (p.body.id || "IMPOSSIBLE_ERR_NO_PLANT_ID").toString(),
            uuid: p.uuid,
            plant: p
          };
        })
        .map(p => {
          return <Link className="plant-link-wrapper"
            style={maybeNoPointer}
            to={"/app/designer/plants/" + p.plantId}
            id={p.plantId}
            onClick={_.noop}
            key={p.plantId}>
            <GardenPlant
              uuid={p.uuid}
              mapTransformProps={mapTransformProps}
              plant={p.plant}
              selected={p.selected}
              dragging={p.selected && dragging && editing}
              dispatch={dispatch}
              zoomLvl={props.zoomLvl}
              activeDragXY={props.activeDragXY} />
          </Link>;
        })}
  </g>;
}
