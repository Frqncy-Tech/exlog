const fs = require('fs')
const path = require('path')
const exlog = require('../index')

const TEST_LOG = path.join(process.cwd(), 'test-exlog.log')

describe('exlog middleware', () => {
    let originalEnv, originalConsoleLog

    beforeEach(() => {
        originalEnv = process.env.NODE_ENV
        originalConsoleLog = console.log
        if (fs.existsSync(TEST_LOG)) fs.unlinkSync(TEST_LOG)
    })

    afterEach(() => {
        process.env.NODE_ENV = originalEnv
        console.log = originalConsoleLog
        if (fs.existsSync(TEST_LOG)) fs.unlinkSync(TEST_LOG)
    })

    // Add a dummy test to verify Jest is running
    it('dummy test', () => {
        expect(1 + 1).toBe(2)
    })

    test('logs to console in non-prod mode', () => {
        process.env.NODE_ENV = 'development'
        let output = ''
        console.log = (msg) => { output += msg + '\n' }
        const req = { ip: '1.2.3.4', protocol: 'http', hostname: 'localhost', originalUrl: '/foo', headers: { foo: 'bar' } }
        const res = {}
        let nextCalled = false
        exlog(req, res, () => { nextCalled = true })
        expect(output).toMatch(/1.2.3.4/)
        expect(output).toMatch(/localhost/)
        expect(nextCalled).toBe(true)
    })

    test('logs to file and redirects console.log in prod mode', () => {
        process.env.NODE_ENV = 'prod'
        exlog.setLogFile(TEST_LOG)
        const req = { ip: '5.6.7.8', protocol: 'https', hostname: 'example.com', originalUrl: '/bar', headers: { baz: 'qux' } }
        const res = {}
        exlog(req, res, () => {})
        // Also test console.log redirection
        console.log('hello world')
        const logContent = fs.readFileSync(TEST_LOG, 'utf8')
        expect(logContent).toMatch(/5.6.7.8/)
        expect(logContent).toMatch(/example.com/)
        expect(logContent).toMatch(/hello world/)
    })
})
