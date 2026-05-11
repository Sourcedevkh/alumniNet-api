const responeFullData = (data) => {
  return {
    id: data.student_id,
    fullname: data.fullname,
    profile_url: data.profile_url,
    gender: data.gender,
    phone: data.phone,
    status: data.status,
    class: data.class_id
      ? {
          id: data.class_id,
          name: data.class_name,
          description: data.class_desc,
        }
      : null,
    generation: data.generation_id
      ? {
          id: data.generation_id,
          name: data.generation_name,
          description: data.generation_desc,
        }
      : null,
    scholarship: data.scholarship_id
      ? {
          id: data.scholarship_id,
          name: data.scholarship_name,
          description: data.scholarship_desc,
        }
      : null,
    shift: data.shift_id
      ? {
          id: data.shift_id,
          name: data.shift_name,
        }
      : null,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

const responeDataAddStudentToClass = (insertId, data) => {
  return {
    id: insertId,
    student: {
      id: data.student_id,
      fullname: data.fullname,
      profile_url: data.profile_url,
      phone: data.phone,
      gender: data.gender,
    },
    class: {
      id: data.class_id,
      name: data.name,
      description: data.description,
    },
    createt_at: data.created_at,
  };
};

module.exports = {
  responeFullData,
  responeDataAddStudentToClass,
};
