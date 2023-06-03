const esprima = require("esprima");

class PurgeFromTsx {
  static extract (content) {
    const classNames = content.match(/(?<=className=[\"\'])[\w-/: ]+(?<!:)/g) || [];
    const classes = classNames.map(el => el.split(' ')).flat();
    const uniqueClasses = [...new Set(classes)];

    return uniqueClasses;
  }
}

module.exports = PurgeFromTsx;

