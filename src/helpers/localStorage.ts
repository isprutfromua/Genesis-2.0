interface Serializable {
  [key: string]: any;
}

interface MapData {
  dataType: "Map";
  value: [string, Serializable][];
}

interface SetData {
  dataType: "Set";
  value: Serializable[];
}

type LocalData = Serializable | MapData | SetData;

const replacer = (_key: string, value: any): LocalData | any => {
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

const reviver = (_key: string, v: any): Serializable | any => {
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

export const setLocalData = (key: string, value: Serializable): void => {
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(value, replacer));
};

export const getLocalData = (key: string): Serializable | null => {
  if (!key) return null;
  const value = localStorage.getItem(key);
  if (!value) return null;
  return JSON.parse(value, reviver);
};
