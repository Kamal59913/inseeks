export const matchActiveUsers = () => ({
  $match: { isActive: true, isDeleted: false },
});

export const lookupRole = () => ({
  $lookup: {
    from: "roles",
    localField: "roleId",
    foreignField: "_id",
    as: "role",
  },
});

export const unwindRole = () => ({
  $unwind: "$role",
});
