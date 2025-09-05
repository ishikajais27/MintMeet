// // Mock child_process spawn function
// const mockSpawn = jest.fn().mockImplementation(() => {
//   return {
//     stdout: {
//       on: jest.fn().mockImplementation((event, callback) => {
//         if (event === 'data') {
//           callback('uploads/generated_badges/mock-badge.png')
//         }
//       }),
//     },
//     stderr: {
//       on: jest.fn().mockImplementation((event, callback) => {
//         // No errors
//       }),
//     },
//     on: jest.fn().mockImplementation((event, callback) => {
//       if (event === 'close') {
//         callback(0) // Success exit code
//       }
//     }),
//   }
// })

// module.exports = {
//   spawn: mockSpawn,
// }
// Mock child_process spawn function
const mockSpawn = jest.fn().mockImplementation(() => {
  return {
    stdout: {
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'data') {
          callback('uploads/generated_badges/mock-badge.png')
        }
      }),
    },
    stderr: {
      on: jest.fn().mockImplementation((event, callback) => {
        // No errors
      }),
    },
    on: jest.fn().mockImplementation((event, callback) => {
      if (event === 'close') {
        callback(0) // Success exit code
      }
    }),
  }
})

module.exports = {
  spawn: mockSpawn,
}
