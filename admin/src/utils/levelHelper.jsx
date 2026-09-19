import store from "../store";

export const getDetailByLevel = (level) => {
  const levelsListGlobal = store.getState().common.levelsList;

  const findLevel = levelsListGlobal.find((each) => each.level == level);

  if (!findLevel) {
    return {};
  }

  return findLevel;
};

export const getLevelTitle = (level) => {
  const levelsListGlobal = store.getState().common.levelsList;

  const findLevel = levelsListGlobal.find((each) => each.level == level);

  if (!findLevel) {
    return level;
  }

  return findLevel.title;
};
