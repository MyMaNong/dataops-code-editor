export const keywordGroup = {
  LATERAL: ['LATERAL VIEW'],
  DISTRIBUTE: ['DISTRIBUTE BY'],
  INNER: ['INNER JOIN'],
  FULL: ['FULL OUTER JOIN'],
  CROSS: ['CROSS JOIN'],
  LEFT: ['LEFT JOIN', 'LEFT OUTER JOIN', 'LEFT SEMI JOIN'],
  RIGHT: ['RIGHT JOIN', 'RIGHT OUTER JOIN', 'RIGHT SEMI JOIN'],
};

export const keywordPriority = {
  SELECT: '0',
  FROM: '0',
  WHERE: '0',
  GROUP: '0',
  ORDER: '0',
  default: '2',
};
