export const getAllForPaginator = async (request = new Promise, params = {}, others = {}) => {

  let offset = 0;
  const limit = 30;
  let data = await request({ offset, limit, ...params }, others);

  let dataAll = data.items;

  do {
    if (data.next) {
      offset = offset + limit;
      data = await request({ offset, limit, ...params }, others);
      dataAll = [...dataAll, ...data.items];
    } else {
      break;
    }
    // eslint-disable-next-line no-constant-condition
  } while (true);

  return dataAll
}
export const getAllForMagicAttr = async (request = new Promise, params = {}, others = {}, attr) => {

  const limit = 30;
  let data = await request({ limit, ...params }, others);

  data = data[attr];

  let dataAll = data.items;


  do {
    if (data.next) {
      const urlSearchParams = new URLSearchParams(data.next);
      const paramsUrl = Object.fromEntries(urlSearchParams.entries());

      data = await request({ after: paramsUrl.after, limit, ...params }, others);
      data = data[attr];
      dataAll = [...dataAll, ...data.items];

    } else {
      break;
    }
    // eslint-disable-next-line no-constant-condition
  } while (true);

  return dataAll;
}


export default { getAllForPaginator, getAllForMagicAttr }