import type { IViewZoneFeature } from './interface';

export const setupViewZoneFeature = (params: IViewZoneFeature) => {
  const { editor, position, getDomNode, ...args } = params;

  let zoneId: string;

  editor.changeViewZones(accessor => {
    zoneId = accessor.addZone({
      suppressMouseDown: false, // 阻止鼠标事件
      afterLineNumber: position.lineNumber,
      afterColumn: position.column,
      domNode: getDomNode(),
      ...args,
    });
  });

  return {
    layout: () => {
      editor.changeViewZones(accessor => {
        accessor.layoutZone(zoneId);
      });
    },
    dispose: () => {
      editor.changeViewZones(accessor => {
        accessor.removeZone(zoneId);
      });
    },
  };
};

export type * from './interface';
