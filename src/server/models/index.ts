import Department from "./department";
import Organization from "./organization";
import Task from "./task";
import Team from "./team";
import Token from "./token";
import User from "./user";
import UserMembership from "./user-membership";
// import UserMembership from "./user-membership";

// initAssociations.ts

User.hasOne(Token);
Token.belongsTo(User);

User.belongsTo(Organization, {
  as: "organization",
  foreignKey: "organizationId",
});
Organization.hasMany(User, {
  as: "members",
  foreignKey: "organizationId",
  onDelete: "CASCADE",
});

User.hasOne(Organization, {
  as: "adminOf",
  foreignKey: "adminId",
  constraints: false,
});
Organization.belongsTo(User, {
  as: "admin",
  foreignKey: "adminId",
  constraints: false,
});

User.belongsToMany(Team, { through: "UserTeam" });
Team.belongsToMany(User, { through: "UserTeam" });

Team.belongsTo(Organization);
Team.belongsTo(Department);

Organization.hasMany(Department);
Department.belongsTo(Organization);

Task.belongsTo(Organization);
Task.belongsTo(Department);

User.hasMany(Task);
Task.belongsTo(User);

Department.hasMany(Task);

User.belongsToMany(Department, {
  through: UserMembership,
  foreignKey: "userId",
  otherKey: "departmentId",
});

Department.belongsToMany(User, {
  through: UserMembership,
  foreignKey: "departmentId",
  otherKey: "userId",
});

UserMembership.belongsTo(Organization, { foreignKey: "organizationId" });
Organization.hasMany(UserMembership, { foreignKey: "organizationId" });

export {
  User,
  Organization,
  Task,
  Department,
  UserMembership,
  Token,
  Team,
};
