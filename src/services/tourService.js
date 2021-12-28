const tokenKey = "watched";

export const getRecentlyWatched = () => {
  try {
    return { watched: localStorage.getItem(tokenKey) };
  } catch (ex) {
    return "";
  }
};

export const setRecentlyWatched = (id) => {
  try {
    let watched = localStorage.getItem(tokenKey);
    if (watched.indexOf(id) > -1) return;
    let arr = watched.split("-");
    if (arr.length > 4) {
      arr[0] = id;
      localStorage.setItem(tokenKey, arr.join("-"));
    } else {
      arr.push(id);
      localStorage.setItem(tokenKey, arr.join("-"));
    }
  } catch (ex) {
    localStorage.setItem(tokenKey, id);
  }
};
