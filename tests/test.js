import { helper } from "../lib/"
import chai from 'chai'
let should = chai.should()

describe("Test lib", () => {
  
  it("test packages are ordered alphabetically", (done) => {
    let devices = helper.adb.devices()
    let packages = helper.get_packages()
    let p = packages[0]
    packages.map( (pkg) => {
      (pkg >= p).should.equal(true)
      p = pkg
    })
    done()  
  })
})
