let roles = [
  { role: 'superadmin', resource: ['*'], action: ['*'], attributes: ['*'] },
  { role: 'admin', resource: ['*','!user'], action: ['*'], attributes: ['*'] },
  { role: 'user', resource: 'profile', action: ['*','!delete'], attributes: ['*'] },
  { role: 'user', resource: 'experience', action: ['*'], attributes: ['*'] },
  { role: 'user', resource: 'education', action: ['*'], attributes: ['*'] },
  { role: 'user', resource: 'category', action: ['search','get'], attributes: ['*']},
  { role: 'user', resource: 'industry', action: ['search','get'], attributes: ['*']},
  { role: 'user', resource: 'jobs', action: ['*','!adminView'], attributes: ['*'] },
  { role: 'user', resource: 'article', action: ['search', 'get'], attributes: ['*'] },
  { role: 'user', resource: 'profile', action: ['*'], attributes: ['*'] },
  { role: 'author', resource: 'article', action: ["*","!publish"], attributes: ['*']},
  { role: 'author', resource: 'category', action: ["search","get"], attributes: ['*']}
];

module.exports = roles;