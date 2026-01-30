const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const teacherPassword = await bcrypt.hash('teacher123', 10)
  const studentPassword = await bcrypt.hash('student123', 10)

  // Users
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@test.com' },
    update: {},
    create: {
      email: 'teacher@test.com',
      name: 'Teacher Lee',
      password: teacherPassword,
      role: 'TEACHER',
    },
  })

  const student = await prisma.user.upsert({
    where: { email: 'student@test.com' },
    update: {},
    create: {
      email: 'student@test.com',
      name: 'Student Zhang',
      password: studentPassword,
      role: 'STUDENT',
    },
  })

  // Class
  const sampleClass = await prisma.class.upsert({
    where: { id: 'cml0h2kwu0003j6598f20efd7' },
    update: {},
    create: {
      id: 'cml0h2kwu0003j6598f20efd7',
      name: 'Computer Science 101',
      description: 'Introduction to programming and Git workflow.',
      teacherId: teacher.id,
    }
  })

  await prisma.classMember.upsert({
    where: { userId_classId: { userId: teacher.id, classId: sampleClass.id } },
    update: {},
    create: { userId: teacher.id, classId: sampleClass.id }
  })

  await prisma.classMember.upsert({
    where: { userId_classId: { userId: student.id, classId: sampleClass.id } },
    update: {},
    create: { userId: student.id, classId: sampleClass.id }
  })

  // Assignment
  const assignment = await prisma.assignment.create({
    data: {
      title: 'Lab 1: Hello Git',
      description: 'Learn how to use Git and Markdown.',
      classId: sampleClass.id,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    }
  })

  // Files
  await prisma.file.createMany({
    data: [
      {
        path: 'Lab1/README.md',
        content: '# Lab 1: Hello Git\n\nWelcome to your first lab! Please submit your answer in your personal folder.\n\n$$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$\n\n![GitHub](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png)',
        classId: sampleClass.id,
        assignmentId: assignment.id,
        isMainBranch: true
      },
      {
        path: `Lab1/${student.name}/README.md`,
        content: '# My Submission\n\nEdit this file to submit your work.',
        classId: sampleClass.id,
        assignmentId: assignment.id,
        userId: student.id,
        isMainBranch: true
      }
    ]
  })

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
