const encodeField = (value) => {
  switch (Object.prototype.toString.call(value)) {
    case "[object Null]":
    case "[object Undefined]":
      return { nullValue: value };
    case "[object Object]":
      return {
        structValue: {
          fields: encodeFields(value),
        },
      };
    case "[object Array]":
      return {
        listValue: {
          values: value.map((_, i) => encodeField(value[i])),
        },
      };
    case "[object Number]":
      return { numberValue: value };
    case "[object Boolean]":
      return { boolValue: value };
    case "[object String]":
      return { stringValue: value };
    case "[object Date]":
      return { stringValue: value.toJSON() };
    case "[object BigNumber]":
      return { stringValue: value.toJSON() };
    default:
      throw new Error("not supported");
  }
};

const encodeFields = (data) =>
  Object.keys(data || {}).reduce(
    (prev, next) => ({
      ...prev,
      [next]: encodeField(data[next]),
    }),
    {}
  );

const encode = (data) => {
  return {
    fields: encodeFields(data),
  };
};

const decodeField = (field) => {
  const kind =
    ["list", "struct", "string", "number", "bool"].find(
      (x) => field[`${x}Value`] !== undefined
    ) || "null";
  const value = field[`${kind}Value`];
  switch (kind) {
    case "string":
    case "number":
    case "bool":
    case "null":
      return value;
    case "struct":
      return decode(value);
    case "list":
      return (value.values || []).map((_, i) => decodeField(value.values[i]));
    default:
      throw new Error("not implemented");
  }
};

const decode = (data) => {
  return Object.keys(data.fields || {}).reduce(
    (prev, next) => ({
      ...prev,
      [next]: decodeField(data.fields[next]),
    }),
    {}
  );
};

exports.encode = encode;
exports.decode = decode;
