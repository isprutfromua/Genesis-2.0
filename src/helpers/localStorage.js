const replacer = (_key, value) => {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: [...value],
    };
  }

  if (value instanceof Set) {
    return {
      dataType: "Set",
      value: [...value],
    };
  }

  return value;
};

const reviver = (_key, v) => {
  if (typeof v === "object" && v !== null) {
    if (v.dataType === "Map") {
      return new Map(v.value);
    }

    if (v.dataType === "Set") {
      return new Set(v.value);
    }
  }
  return v;
};

export const setLocalData = (key, v) => {
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(v, replacer));
};

export const getLocalData = (key) => {
  if (!key) return;
  return JSON.parse(localStorage.getItem(key), reviver);
};
