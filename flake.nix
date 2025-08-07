{
  description = "Camera Capture App with Vite + TypeScript + Nix";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }: flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs { inherit system; };
    in {
      devShells.default = pkgs.mkShell {
        buildInputs = [
          pkgs.nodejs_20
          pkgs.vite
        ];

        shellHook = ''
          echo "Welcome to Camera Capture TS Dev Shell"
          export NODE_ENV=development
        '';

        apps.default = {
          type = "app";
          program = "${pkgs.vite}/bin/vite";
        };
      };
    }
  );
}

