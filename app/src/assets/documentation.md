# LocalStack Documentation

This page contains the documentation instructions for LocalStack Enterprise version.

**Note:** This page is being updated on a reguar basis - more details following soon.

## Installation

### Prerequisites

* **Docker**: The recommended way of installing LocalStack is using Docker
* **Python**: Required to install the `localstack` command-line interface (CLI)

### Installation

The easiest way to install LocalStack is via `pip`:

```
pip install localstack
```

You can then list the available commands:
```
localstack --help
```

**Note:** If the command `localstack` is not available after successfully installing the package, please ensure that the folder containing `pip` binaries is configured in your `$PATH`.

### Environment Setup

Using the enterprise services requires a valid subscription with an API key. Your API keys are listed on the [subscriptions page](/settings), and can be activated using the environment variable `LOCALSTACK_API_KEY`.

**Example:** In order to use the API key  `key123`, use the following command in your environment:
```
export LOCALSTACK_API_KEY=key123
```

### Starting Up

To start the LocalStack platform in your local Docker environment:
```
localstack start --docker
```

### Configuring Local DNS Server

LocalStack Enterprise supports transparent execution mode, which means that your application code automatically accesses the LocalStack APIs on `localhost`, as opposed to the real APIs on AWS. In contrast, the community (open source) edition requires the application code to configure each AWS SDK client instance with the target `endpoint URL` to point to the respective ports on `localhost` (see list of default ports [here](https://github.com/localstack/localstack)).

In order to use transparent execution mode, the system needs to be configured to use the predefined DNS server on `200.200.55.55`. The DNS configuration depends on the operating system: in Mac OS it can be configured in the Network System Settings, under Linux this is usually achieved by configuring `/etc/resolv.conf` as follows:
```
nameserver 200.200.55.55
```

**Note:** Please be careful when changing the network configuration on your system, as this may have undesired side effects.

**Note**: When you configure transparent execution mode, you may still have to configure your application's AWS SDK to **accept self-signed certificates**. This is a technical limitation caused by the SSL certificate validation mechanism, due to the fact that we are repointing AWS domain names (e.g., `*.amazonaws.com`) to `localhost`.

## Support

For any technical enquiries or questions regarding usage of LocalStack itself, the best resource is usually to search the [list of issues](https://github.com/localstack/localstack/issues) in the Github repository. In many cases, it is easy to find a solution using the issue search function on Github. Otherwise, please raise a new issue on Github with a detailed error description.

### Deviations From AWS APIs

The AWS cloud is a very dynamic environment with constant extension and improvement of APIs. Due to the sheer size and complexity of the AWS environment, we cannot guarantee 100% compatibility with all APIs at all times. Occasionally, the behavior of the LocalStack APIs may slightly deviate from AWS, although in general we try to ensure that the core functionality has high level of compatibility.

### Bug Reports

As in any other software product, the user may occasionally run into errors reported by the platform. Some issues are caused by invalid or unexpected input values from the user's applications, some are caused by a flaw in the internal implementation. We are working very hard to fix bugs in a timely manner and maintain a high level of quality of the platform.

When creating issues and bug reports, please make sure to include a detailed description of the error (including debug logs, error messages, etc), as well as information about the environment in which the error has occurred.

Requests are processed on a best-effort basis. Depending on your level of support, we may be able (but cannot guarantee) to prioritize your support requests.

### General Enquiries

For enquiries regarding billing, subscriptions, or other administrative issues, please send us an email to [info@localstack.cloud](info@localstack.cloud).

## Community vs Enterprise Edition

A free edition of LocalStack is provided as an open source [project on Github](https://github.com/localstack/localstack). The free edition has a limited feature set, and lacks any enterprise features like dashboarding, analytics, or customer support.
