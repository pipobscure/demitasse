# Test Frameworks / Harnesses

**Why another Test-Framework?** – because the exiting frameworks don't fulfill all the criteria we should demand from a modern test-framework.

This is a detailed documentation of what these requirements are, and in how far the existing popular frameworks meet or fail to meet them. As such it also becomes an explanation for the introduction of Demi-Tasse.

## Requirements

### Global Environment Pollution

Many test-frameworks consider it acceptable to add things to the global name-space. This is generally considered bad practice in regular programming, but considered to be acceptable for writing tests since the tests never run in production.

We should consider this malpractice unacceptable even for tests. For one thing, the design of some execution environments prohibit and prevents accessing the global name-space to begin with.

### Distinct Test-Phases

Any well behaved test-framework should run test-suites in two distinct phases:

1.  Test Setup – wherein the tests are defined and the total number of test-suites and test-cases becomes known
2.  Test Execution - wherein the previously defined tests are executed and their results reported

Without this separation, one failed test would block other test from even being initialized. So if the test suite is not at 100% passing, it would be impossible to report how close to 100% passing the suite is.

Most frameworks do in fact operate on this basis, with the noticeable exceptions of tap/tape.

### Deeply Nested Test-Suites <a name="deep-nested"/>

Test-frameworks should enable easy grouping of tests, both by test-driver as well as within a test-driver. The more complex an application becomes, the more important this becomes.

### Reporter Independent

The actual reporting format is actually less important since they are fairly easily transformed from one to another. However there are some properties that are relevant:

- Test output should be connected to the structure of the test file in a way that is easy to determine.
- Tests should be output in a predictable order.
- Connecting to existing reporting infrastructure should be easy. (Running from insider {RPDE} for example should hook into its reporter.

### Specific with few dependencies

Test-frameworks should not bring in more dependencies than the application being tested. In particular many test-frameworks include coverage analysis, one or more assertion libraries, and more.

A test-frameworks should rather be agnostic toward these things. There are already good tools to provide for coverage, assertions and more.

### Tests should be Executable

Tests should be written to be stand-alone apps. They should not require a specific test-runner to run. While this is more relevant for regular node.js programs, it holds true for R+ tests to the extent that a test-driver should – and currently is – nothing more that a plain application entry-point.

In particular this means that the test-driver should not assume the presence of global variables that are not present when running as a plain application. This can lead to name-space collisions and is therefore bad-practice.

## Framework Comparison

### JSCore.test

For the longest time the testing framework provided by `JSCore` was the only one available in R+ that would behave well with {RPDE}. For that reason it has become – if not popular then at least - frequently used.

However the `JSCore.test` framework does not meet the requirements laid out above.

- Global Environment Pollution – **pass**
- Distinct Test-Phases – **pass**
- Deeply Nested Test-Suites - **fail**
- Reporter Independent - **semi-fail**
- Specific with few dependencies – **fail**
- Tests should be Executable - **pass**

### Tap / Tape

[Tap](https://npmjs.org/package/tap)/[Tape](https://npmjs.org/package/tape) while based on a few [good ideas](https://node-tap.org) also does not fulfill all requirements. Especially the lack of distinct test-phases makes it hard to recommend.

- Global Environment Pollution – **pass**
- Distinct Test-Phases – **fail**
- Deeply Nested Test-Suites - **pass**
- Reporter Independent - **fail**
- Specific with few dependencies - **fail**
- Tests should be Executable - **pass**

### Mocha

[Mocha](https://mochajs.org) is one of the most popular JavaScript test-frameworks. However besides failing the mentioned requirements, it also brings in a large number of superfluous dependencies, that should not be part of a test-framework.

- Global Environment Pollution – **fail**
- Distinct Test-Phases – **pass**
- Deeply Nested Test-Suites - **pass**
- Reporter Independent - **pass**
- Specific with few dependencies - **fail**
- Tests should be Executable - **fail**

### Jasmine

[Jasmine](https://jasmine.github.io/) is another popular test-framework, and again it fails in the basic requirements.

- Global Environment Pollution – **fail**
- Distinct Test-Phases – **pass**
- Deeply Nested Test-Suites - **pass**
- Reporter Independent - **fail**
- Specific with few dependencies - **fail**
- Tests should be Executable - **fail**

### Jest

[Jest](https://facebook.github.io/jest/) powered by Facebook has gained traction. It's particularly well suited to testing React applications. However it again pollutes the global name-space and brings in the kitchen sink.

- Global Environment Pollution – **fail**
- Distinct Test-Phases – **pass**
- Deeply Nested Test-Suites - **pass**
- Reporter Independent - **fail**
- Specific with few dependencies - **fail**
- Tests should be Executable - **fail**

## Output / Reporting

The output that tests generate should follow logically from the requirements above. In particular the requirement for [Deeply Nested Test-Suites](#deeply-nested) mandates a reporting format that is flexible in that regard.

### JUnit

JUnit is an XML based the test-output format used by the tests in [Apache Ant](http://ant.apache.org/) - a Java build tool - a subset of which is directly supported by Jenkins Hudson via a plugin.

It's short-coming is its lack of representation for deeply nested test-suites.

### XUnit

Is an open source [test-framework intended for .Net](https://github.com/xunit/xunit) whose – XML based – output has been adopted buy other frameworks and is also supported by Jenkins Hudson as a plugin.

Again its shot-coming is the lack of representation for deeply nested test-suites.

### TAP

TAP is short for [Test Anything Protocol](https://testanything.org/) and comes out of the PERL community. It is a well specified line-based protocol whose format has been adopted widely in the node.js community.

By itself it suffers even more from a lack of representation for deeply nested test-suites since it only supports one level. However the definition of TAP specifies that a consumer should ignore lines it does not understand. Dues to this flexibility [Node-TAP](http://www.node-tap.org) the original TAP test-framework for node.js has defined [sub-tests]([Node-TAP](http://www.node-tap.org/subtests) by requiring indentation for sub-tests that when unindented again form a valid TAP-stream.

This way TAP actually does present a well defined format for representing the result of arbitrarily deeply nested test-suites. There is a [parser available](https://www.npmjs.com/package/tap-parser) that understands the sub-test format. Based on that it is possible to transform TAP-output to any other format.

### JSON

JSON can be used to represent pretty much anything. As such it makes for an excellent simple output format. As such it makes for an excellent default.
