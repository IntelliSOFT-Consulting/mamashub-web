export const getSections = (datas, start, end) => {
  let sections = Object.keys(datas);
  let section = sections.slice(start, end);
  let data = {};
  section.forEach(item => {
    data[item] = datas[item];
  });
  return data;
};
