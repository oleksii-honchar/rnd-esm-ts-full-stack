export class PurgeFromTsx {
  static extract(content: any) {
    const classNames = content.match(/(?<=className=[\"\'])[\w-/: ]+(?<!:)/g) || [];
    const classes = classNames.map((el: any) => el.split(" ")).flat();
    const uniqueClasses = [...new Set(classes)];

    return uniqueClasses;
  }
}
