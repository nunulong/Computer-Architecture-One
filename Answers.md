# Sprint-Challenge--Computer-Architecture

## Binary, Decimal, and Hex

Complete the following problems:

* Convert `11001111` binary

    to hex: 0xCF | JavaScript: `(0b11001111).toString(16)`

    to decimal: 207 | Javascript: `parseInt('11001111', 2)`

- Convert `4C` hex

    to binary: 0b01001100 | JavaScript: `(0x4c).toString(2)`

    to decimal: 76 | JavaScript: `parseInt('4c', 16)`

* Convert `68` decimal

    to binary: 0b01000100 | JavaScript: `(68).toString(2)`

    to hex: 0x44 | JavaScript: `(68).toString(16)`

## Architecture

One paragraph-ish:

* Explain how the CPU provides concurrency:

Answer: CPU provides multiple threads of control to execute different processes at the same time. Usually different processes are executed by CPU alternately. One process is being executed and other processes will be suspended and all the states are saved to stack. Once the interrupt is raised by instruction in CPU, the executing process will be suspended, and the triggered process will load all the state from the stack and resume execution. If CPU has multiple cores to execute processes, then the efficiency of concurrency will become higher than signle core CPU.

* Describe assembly language and machine language:

Answer: Assembly language sits on top of machine language. With assembly language, you can use mnemonic sequences instead of numeric operation codes and use symbolic labels instead of manually calculating offset. Other than that, assembly language is really the equivalent of the machine language.

* Suggest the role that graphics cards play in machine learning:

Answer: Graphics cards have thousands of simpler cores, thousand of concurrent hardware threads that can maximize floating-point throughput and do simple mathematical opeartions in parallel. Usually they are used for neutral network deep learning since GPU performs tasks in parallel where as CPU executes one task at a time. GPU is boosting the deep learning field and could be new CPU.
