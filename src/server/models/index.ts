import Department from "./department";
import Organization from "./organization";
import Task from "./task";
import Token from "./token";
import User from "./user";
// import UserMembership from "./user-membership";

// initAssociations.ts
User.hasMany(Task, { as: "tasks" });

User.hasOne(Token);
Token.belongsTo(User);

User.belongsTo(Organization, { as: "organization", foreignKey: "organizationId" });
Organization.hasMany(User, {
  as: "members",
  foreignKey: "organizationId",
  onDelete: "CASCADE",
});

User.hasOne(Organization, { as: "adminOf", foreignKey: "adminId", constraints: false });
Organization.belongsTo(User, {
  as: "admin",
  foreignKey: "adminId",
  constraints: false,
});

Organization.hasMany(Department);
Department.belongsTo(Organization);

Task.belongsTo(Organization);
Task.belongsTo(Department);
Task.belongsTo(User);

User.belongsToMany(Department, { through: "UserMembership" });
Department.belongsToMany(User, { through: "UserMembership" });

export {
  User,
  Organization,
  Task,
  Department,
  // , UserMembership
  Token,
};
