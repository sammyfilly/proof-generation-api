/* eslint-disable no-undef */
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const baseUrl = `localhost:${
  process.env.npm_config_port ? process.env.npm_config_port : 5000
}`

chai.use(chaiHttp)
describe('Proof Generation API Tests', () => {
  // test to check if endpoint it live
  it('server is live', function(done) {
    chai
      .request(baseUrl)
      .get('/health-check')
      .end(function(err, res) {
        if (err) {
          console.log(err)
        }
        expect(res).to.have.status(200)
        done()
      })
  })

  //
  // test to check block inclusion endpoint
  //
  it('block inclusion test', (done) => {
    chai
      .request(baseUrl)
      .get('/api/v1/matic/block-included/1234')
      .end(function(err, res) {
        if (err) {
          console.log(err)
        }
        expect(res).to.have.status(200)
        expect(res.body.message).to.equal('success')
        done()
      })
  })

  it('block non inclusion test', (done) => {
    chai
      .request(baseUrl)
      .get('/api/v1/matic/block-included/999999999999999')
      .end(function(err, res) {
        if (err) {
          console.log(err)
        }
        expect(res).to.have.status(404)
        expect(res.body.error).to.be.true
        done()
      })
  })

  it('invalid block number test', (done) => {
    chai
      .request(baseUrl)
      .get('/api/v1/matic/block-included/12324.56')
      .end(function(err, res) {
        if (err) {
          console.log(err)
        }
        expect(res).to.have.status(400)
        expect(res.body.error).to.be.true
        done()
      })
  })

  //
  // tests to check merkle proof generation
  //
  it('merkle proof generation test', (done) => {
    chai
      .request(baseUrl)
      .get('/api/v1/matic/fast-merkle-proof?start=12345&end=12347&number=12346')
      .end(function(err, res) {
        if (err) {
          console.log(err)
        }
        expect(res).to.have.status(200)
        expect(res.body.proof).to.equal(
          '0xc62218dfcdc47711e777e6036806592cac1e079f55e2f8f30e6b165bf8737d163643be7c8414f4fc0cfebecce5ba6c663dfbcd74359e3847a429c268777342bb'
        )
        done()
      })
  })

  it('invalid merkle proof generation arguments test - 1', (done) => {
    chai
      .request(baseUrl)
      .get(
        '/api/v1/matic/fast-merkle-proof?start=12345.54&end=12347&number=12346'
      )
      .end(function(err, res) {
        if (err) {
          console.log(err)
        }
        expect(res).to.have.status(400)
        expect(res.body.error).to.be.true
        done()
      })
  })

  it('invalid merkle proof generation arguments test - 2', (done) => {
    chai
      .request(baseUrl)
      .get('/api/v1/matic/fast-merkle-proof?start=12345&end=12347&number=12348')
      .end(function(err, res) {
        if (err) {
          console.log(err)
        }
        expect(res).to.have.status(400)
        expect(res.body.error).to.be.true
        done()
      })
  })

  it('invalid merkle proof generation arguments test - 3', (done) => {
    chai
      .request(baseUrl)
      .get('/api/v1/matic/fast-merkle-proof?start=12348&end=12347&number=12347')
      .end(function(err, res) {
        if (err) {
          console.log(err)
        }
        expect(res).to.have.status(400)
        expect(res.body.error).to.be.true
        done()
      })
  })

  //
  // tests to check exit payload endpoint
  //
  it('exit payload test', (done) => {
    chai
      .request(baseUrl)
      .get(
        '/api/v1/matic/exit-payload/0x1a7b6aba7e51344474d4fe722a3969e8c7a863c72329210a0dda80d26c4234b4?eventSignature=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
      )
      .end(function(err, res) {
        if (err) {
          console.log(err)
        }
        expect(res).to.have.status(200)
        expect(res.body.result).to.equal(
          '0xf90a2484062ccf80b901a0859aee58a5e22abc255a961ed720398167e1b4cd294eae9a7399d019d9c4e1d75642ae9ba08dd45e50ee2735d1e04689003adc2abafa10a18f805b0a34c0024feb8bc5a120ab6ec4bb9a433937fc2509282e7862b8eba222f0bdc3e7e2454ba5c95bee107972b19696be1543f253f7308e29c52880e9fa14d3f6e81669e80de6c2772915fdec333d3adf2812b0f00f63ceb808e01abc29c5a016820f3ef6fd6d2cefb60588fb9dd3c1dafcefeef8e2fe9b19b87d64cf145d385752e91047316c795e4ed5f9c1c7e5fe05f29ddb22b53cf7c4c30ede180334f4c3f794eee3bd73e776159f999a764ea745f9b95fea751209f82a8c2a114502fd9201155bc1d982ea44b787110059f8116dd91b46b6cb5289d7bdecae440c3c4c6d8e94779ae92607ca6025122944e2d84f9ee54f9dc282623a6f84f8617f706666fbe2a2af8f2643e1a9c662c576932d9116d244c407dcdc8a98bf935e622d3bb5171b9e2d0ada104d0d9e7d3f847b1a2708842d8fbe5ac97085abec56ded868e72f758c80b11dff739db9cf7ec33e7ab092f26a81499bd08774e75ad7ef54d4b9bbf63a87199c83b14ca3846041a06aa0a56c584ef27b5d8aec36e90dc5c50b1e0279f8ae40367343699d9f7ef60f1cb8a0c37362a665ea9596ce130e50ba31f673672dfc7e946870c1cbb20884269e5d4fb903e5f903e20182eca8b9010080000000000000001000000000000000000000000020000000000000000000000000000000000000000000000000000000008000000000000000000000000000000004000000000000000008000000801000000000000000000100100000000000000000020040000000400000000800000000000000000080000010000000000000000000000000800000000000000000000000000000000010008000000000200000000000000000000000000000000000000000000000000000000000004200000002000000000001000000000100000000000000000000100000020020000000000000000000000000000100000000000000000000000000000000100000f902d8f8f994b6509cbd9e2d1cec787a7357eb1578b86a0c702de1a05845892132946850460bff5a0083f71031bc5bf9aadcd40f1de79423eac9b10bb8c0000000000000000000000000ee07e15cc748c7eb048a62513fabaaea06437c8d0000000000000000000000006f78edb81c80a62cafb51a60a1ae7454e7df566a000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000242e1a7d4d0000000000000000000000000000000000000000000000008ac7230489e8000000000000000000000000000000000000000000000000000000000000f89b94b6509cbd9e2d1cec787a7357eb1578b86a0c702df863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000ee07e15cc748c7eb048a62513fabaaea06437c8da00000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000008ac7230489e80000f9013d940000000000000000000000000000000000001010f884a04dfe1bbbcf077ddc3e01291eea2d5c70c2b422b415d95645b9adcfd678cb1d63a00000000000000000000000000000000000000000000000000000000000001010a00000000000000000000000006f78edb81c80a62cafb51a60a1ae7454e7df566aa00000000000000000000000007b5000af8ab69fd59eb0d4f5762bff57c9c04385b8a000000000000000000000000000000000000000000000000000003719cfcc90000000000000000000000000000000000000000000000000008871276c6327b000000000000000000000000000000000000000000000000046fbc84ada927603580000000000000000000000000000000000000000000000008870f052935b2000000000000000000000000000000000000000000000000046fbc881f462429358b90442f9043ff851a0bffd3fda9d181dba4087d9716f500227e815733cd15ad2d99cce31d0ef3bc87680808080808080a048093616212606eba6a7cb9ac991176023fe7bbac5b8760b94a81254de8f3f3f8080808080808080f903e930b903e5f903e20182eca8b9010080000000000000001000000000000000000000000020000000000000000000000000000000000000000000000000000000008000000000000000000000000000000004000000000000000008000000801000000000000000000100100000000000000000020040000000400000000800000000000000000080000010000000000000000000000000800000000000000000000000000000000010008000000000200000000000000000000000000000000000000000000000000000000000004200000002000000000001000000000100000000000000000000100000020020000000000000000000000000000100000000000000000000000000000000100000f902d8f8f994b6509cbd9e2d1cec787a7357eb1578b86a0c702de1a05845892132946850460bff5a0083f71031bc5bf9aadcd40f1de79423eac9b10bb8c0000000000000000000000000ee07e15cc748c7eb048a62513fabaaea06437c8d0000000000000000000000006f78edb81c80a62cafb51a60a1ae7454e7df566a000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000242e1a7d4d0000000000000000000000000000000000000000000000008ac7230489e8000000000000000000000000000000000000000000000000000000000000f89b94b6509cbd9e2d1cec787a7357eb1578b86a0c702df863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000ee07e15cc748c7eb048a62513fabaaea06437c8da00000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000008ac7230489e80000f9013d940000000000000000000000000000000000001010f884a04dfe1bbbcf077ddc3e01291eea2d5c70c2b422b415d95645b9adcfd678cb1d63a00000000000000000000000000000000000000000000000000000000000001010a00000000000000000000000006f78edb81c80a62cafb51a60a1ae7454e7df566aa00000000000000000000000007b5000af8ab69fd59eb0d4f5762bff57c9c04385b8a000000000000000000000000000000000000000000000000000003719cfcc90000000000000000000000000000000000000000000000000008871276c6327b000000000000000000000000000000000000000000000000046fbc84ada927603580000000000000000000000000000000000000000000000008870f052935b2000000000000000000000000000000000000000000000000046fbc881f46242935882008001'
        )
        done()
      })
  })

  it('exit payload with tokenIndex argument test', (done) => {
    chai
      .request(baseUrl)
      .get(
        '/api/v1/matic/exit-payload/0x1a7b6aba7e51344474d4fe722a3969e8c7a863c72329210a0dda80d26c4234b4?eventSignature=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&tokenIndex=0'
      )
      .end(function(err, res) {
        if (err) {
          console.log(err)
        }
        expect(res).to.have.status(200)
        expect(res.body.result).to.equal(
          '0xf90a2484062ccf80b901a0859aee58a5e22abc255a961ed720398167e1b4cd294eae9a7399d019d9c4e1d75642ae9ba08dd45e50ee2735d1e04689003adc2abafa10a18f805b0a34c0024feb8bc5a120ab6ec4bb9a433937fc2509282e7862b8eba222f0bdc3e7e2454ba5c95bee107972b19696be1543f253f7308e29c52880e9fa14d3f6e81669e80de6c2772915fdec333d3adf2812b0f00f63ceb808e01abc29c5a016820f3ef6fd6d2cefb60588fb9dd3c1dafcefeef8e2fe9b19b87d64cf145d385752e91047316c795e4ed5f9c1c7e5fe05f29ddb22b53cf7c4c30ede180334f4c3f794eee3bd73e776159f999a764ea745f9b95fea751209f82a8c2a114502fd9201155bc1d982ea44b787110059f8116dd91b46b6cb5289d7bdecae440c3c4c6d8e94779ae92607ca6025122944e2d84f9ee54f9dc282623a6f84f8617f706666fbe2a2af8f2643e1a9c662c576932d9116d244c407dcdc8a98bf935e622d3bb5171b9e2d0ada104d0d9e7d3f847b1a2708842d8fbe5ac97085abec56ded868e72f758c80b11dff739db9cf7ec33e7ab092f26a81499bd08774e75ad7ef54d4b9bbf63a87199c83b14ca3846041a06aa0a56c584ef27b5d8aec36e90dc5c50b1e0279f8ae40367343699d9f7ef60f1cb8a0c37362a665ea9596ce130e50ba31f673672dfc7e946870c1cbb20884269e5d4fb903e5f903e20182eca8b9010080000000000000001000000000000000000000000020000000000000000000000000000000000000000000000000000000008000000000000000000000000000000004000000000000000008000000801000000000000000000100100000000000000000020040000000400000000800000000000000000080000010000000000000000000000000800000000000000000000000000000000010008000000000200000000000000000000000000000000000000000000000000000000000004200000002000000000001000000000100000000000000000000100000020020000000000000000000000000000100000000000000000000000000000000100000f902d8f8f994b6509cbd9e2d1cec787a7357eb1578b86a0c702de1a05845892132946850460bff5a0083f71031bc5bf9aadcd40f1de79423eac9b10bb8c0000000000000000000000000ee07e15cc748c7eb048a62513fabaaea06437c8d0000000000000000000000006f78edb81c80a62cafb51a60a1ae7454e7df566a000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000242e1a7d4d0000000000000000000000000000000000000000000000008ac7230489e8000000000000000000000000000000000000000000000000000000000000f89b94b6509cbd9e2d1cec787a7357eb1578b86a0c702df863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000ee07e15cc748c7eb048a62513fabaaea06437c8da00000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000008ac7230489e80000f9013d940000000000000000000000000000000000001010f884a04dfe1bbbcf077ddc3e01291eea2d5c70c2b422b415d95645b9adcfd678cb1d63a00000000000000000000000000000000000000000000000000000000000001010a00000000000000000000000006f78edb81c80a62cafb51a60a1ae7454e7df566aa00000000000000000000000007b5000af8ab69fd59eb0d4f5762bff57c9c04385b8a000000000000000000000000000000000000000000000000000003719cfcc90000000000000000000000000000000000000000000000000008871276c6327b000000000000000000000000000000000000000000000000046fbc84ada927603580000000000000000000000000000000000000000000000008870f052935b2000000000000000000000000000000000000000000000000046fbc881f462429358b90442f9043ff851a0bffd3fda9d181dba4087d9716f500227e815733cd15ad2d99cce31d0ef3bc87680808080808080a048093616212606eba6a7cb9ac991176023fe7bbac5b8760b94a81254de8f3f3f8080808080808080f903e930b903e5f903e20182eca8b9010080000000000000001000000000000000000000000020000000000000000000000000000000000000000000000000000000008000000000000000000000000000000004000000000000000008000000801000000000000000000100100000000000000000020040000000400000000800000000000000000080000010000000000000000000000000800000000000000000000000000000000010008000000000200000000000000000000000000000000000000000000000000000000000004200000002000000000001000000000100000000000000000000100000020020000000000000000000000000000100000000000000000000000000000000100000f902d8f8f994b6509cbd9e2d1cec787a7357eb1578b86a0c702de1a05845892132946850460bff5a0083f71031bc5bf9aadcd40f1de79423eac9b10bb8c0000000000000000000000000ee07e15cc748c7eb048a62513fabaaea06437c8d0000000000000000000000006f78edb81c80a62cafb51a60a1ae7454e7df566a000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000242e1a7d4d0000000000000000000000000000000000000000000000008ac7230489e8000000000000000000000000000000000000000000000000000000000000f89b94b6509cbd9e2d1cec787a7357eb1578b86a0c702df863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000ee07e15cc748c7eb048a62513fabaaea06437c8da00000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000008ac7230489e80000f9013d940000000000000000000000000000000000001010f884a04dfe1bbbcf077ddc3e01291eea2d5c70c2b422b415d95645b9adcfd678cb1d63a00000000000000000000000000000000000000000000000000000000000001010a00000000000000000000000006f78edb81c80a62cafb51a60a1ae7454e7df566aa00000000000000000000000007b5000af8ab69fd59eb0d4f5762bff57c9c04385b8a000000000000000000000000000000000000000000000000000003719cfcc90000000000000000000000000000000000000000000000000008871276c6327b000000000000000000000000000000000000000000000000046fbc84ada927603580000000000000000000000000000000000000000000000008870f052935b2000000000000000000000000000000000000000000000000046fbc881f46242935882008001'
        )
        done()
      })
  })

  it('invalid exit payload arguments test - 1', (done) => {
    chai
      .request(baseUrl)
      .get(
        '/api/v1/matic/exit-payload/272ce652e562677a0db65f95d0c0dc1dd11ef6b2099f09acdaf9b831b51f6804?eventSignature=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
      )
      .end(function(err, res) {
        if (err) {
          console.log(err)
        }
        expect(res).to.have.status(400)
        expect(res.body.error).to.be.true
        done()
      })
  })

  it('invalid exit payload arguments test - 2', (done) => {
    chai
      .request(baseUrl)
      .get(
        '/api/v1/matic/exit-payload/0x272ce652e562?eventSignature=0xdf252ad1be2c89b69c2b068fc378daa95'
      )
      .end(function(err, res) {
        if (err) {
          console.log(err)
        }
        expect(res).to.have.status(400)
        expect(res.body.error).to.be.true
        done()
      })
  })

  it('invalid exit payload arguments test - 3', (done) => {
    chai
      .request(baseUrl)
      .get(
        '/api/v1/matic/exit-payload/0x1a7b6aba7e51344474d4fe722a3969e8c7a863c72329210a0dda80d26c4234b4?eventSignature=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&tokenIndex=1'
      )
      .end(function(err, res) {
        if (err) {
          console.log(err)
        }
        expect(res).to.have.status(404)
        expect(res.body.error).to.be.true
        done()
      })
  })

  it('erc1155 exit payload test', (done) => {
    chai
      .request(baseUrl)
      .get(
        '/api/v1/matic/exit-payload/0x4d4a9ee49a681a97ade92788f2fdce1d1761978ab491c2a10eb6849101cd63fe?eventSignature=0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb'
      )
      .end(function(err, res) {
        if (err) {
          console.log(err)
        }
        expect(res).to.have.status(200)
        // expect(res.body.result).to.be.true
        done()
      })
  })

  it('erc721 all exit payloads test', (done) => {
    chai
      .request(baseUrl)
      .get(
        '/api/v1/mumbai/all-exit-payloads/0x54f47c891b460369661e22e27eeb4afbbb5dd792c7c8b48cab758892c14ffe85?eventSignature=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
      )
      .end(function(err, res) {
        if (err) {
          console.log(err)
        }
        expect(res).to.have.status(200)
        expect(res.body.result.length).to.equal(2)
        done()
      })
  })

  it('invalid network param test on block-included', (done) => {
    chai
      .request(baseUrl)
      .get('/api/v1/mainnet/block-included/3000000')
      .end(function(err, res) {
        if (err) {
          console.log(err)
        }
        expect(res).to.have.status(400)
        expect(res.body.error).to.be.true
        done()
      })
  })

  it('invalid network param test on fast-merkle-proof', (done) => {
    chai
      .request(baseUrl)
      .get(
        '/api/v1/testnet/fast-merkle-proof?start=12345&end=12347&number=12346'
      )
      .end(function(err, res) {
        if (err) {
          console.log(err)
        }
        expect(res).to.have.status(400)
        expect(res.body.error).to.be.true
        done()
      })
  })

  it('invalid network param test on exit-payload', (done) => {
    chai
      .request(baseUrl)
      .get(
        '/api/v1/mum/exit-payload/0x1a7b6aba7e51344474d4fe722a3969e8c7a863c72329210a0dda80d26c4234b4?eventSignature=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
      )
      .end(function(err, res) {
        if (err) {
          console.log(err)
        }
        expect(res).to.have.status(400)
        expect(res.body.error).to.be.true
        done()
      })
  })

  it('invalid network param test on all-exit-payloads', (done) => {
    chai
      .request(baseUrl)
      .get(
        '/api/v1/mainnet/all-exit-payloads/0x54f47c891b460369661e22e27eeb4afbbb5dd792c7c8b48cab758892c14ffe85?eventSignature=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
      )
      .end(function(err, res) {
        if (err) {
          console.log(err)
        }
        expect(res).to.have.status(400)
        expect(res.body.error).to.be.true
        done()
      })
  })
})
