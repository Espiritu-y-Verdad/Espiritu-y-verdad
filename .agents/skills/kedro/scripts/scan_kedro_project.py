#!/usr/bin/env python3
"""Inspect a Kedro project layout and report structural findings.

Usage:
    python scripts/scan_kedro_project.py /path/to/project

The script prints a JSON report that helps identify whether a repository is a
valid or likely Kedro project, what core files are present, and which common
best-practice gaps are worth addressing.
"""

from __future__ import annotations

import json
import sys
import tomllib
from pathlib import Path
from typing import Any


def load_pyproject(project_root: Path) -> dict[str, Any]:
    pyproject_path = project_root / "pyproject.toml"
    if not pyproject_path.exists():
        return {}
    try:
        with pyproject_path.open("rb") as file:
            return tomllib.load(file)
    except Exception as exc:  # pragma: no cover - defensive
        return {"_error": str(exc)}


def list_files(root: Path, pattern: str) -> list[str]:
    return sorted(str(path.relative_to(root)) for path in root.glob(pattern))


def infer_package_dir(project_root: Path, kedro_meta: dict[str, Any]) -> Path | None:
    source_dir = kedro_meta.get("source_dir", "src")
    package_name = kedro_meta.get("package_name")

    if package_name:
        candidate = project_root / source_dir / package_name
        if candidate.exists():
            return candidate

    src_dir = project_root / source_dir
    if src_dir.exists():
        candidates = [
            child
            for child in src_dir.iterdir()
            if child.is_dir() and (child / "pipeline_registry.py").exists()
        ]
        if len(candidates) == 1:
            return candidates[0]

    return None


def build_report(project_root: Path) -> dict[str, Any]:
    pyproject = load_pyproject(project_root)
    kedro_meta = pyproject.get("tool", {}).get("kedro", {}) if isinstance(pyproject, dict) else {}
    package_dir = infer_package_dir(project_root, kedro_meta)

    conf_dir = project_root / "conf"
    base_dir = conf_dir / "base"
    local_dir = conf_dir / "local"
    tests_dir = project_root / "tests"

    pipelines_dir = package_dir / "pipelines" if package_dir else None
    pipeline_folders = []
    if pipelines_dir and pipelines_dir.exists():
        pipeline_folders = sorted(
            child.name
            for child in pipelines_dir.iterdir()
            if child.is_dir() and not child.name.startswith("__")
        )

    findings: list[str] = []
    recommendations: list[str] = []

    if not (project_root / "pyproject.toml").exists():
        findings.append("Missing pyproject.toml")
        recommendations.append("Add pyproject.toml with a [tool.kedro] section.")

    if not kedro_meta:
        findings.append("Missing [tool.kedro] metadata")
        recommendations.append("Define package_name, project_name, kedro_init_version, and source_dir in pyproject.toml.")

    if package_dir is None:
        findings.append("Could not infer package directory from Kedro metadata")
        recommendations.append("Verify source_dir and package_name, then ensure settings.py and pipeline_registry.py live under the package directory.")

    if not conf_dir.exists():
        findings.append("Missing conf directory")
        recommendations.append("Add conf/base and conf/local unless intentionally using a custom configuration source.")
    else:
        if not base_dir.exists():
            findings.append("Missing conf/base")
            recommendations.append("Add conf/base for shared defaults such as catalog and parameters.")
        if not local_dir.exists():
            findings.append("Missing conf/local")
            recommendations.append("Add conf/local for user-specific or secret configuration, even if empty and gitignored.")

    if package_dir:
        if not (package_dir / "settings.py").exists():
            findings.append("Missing settings.py")
            recommendations.append("Add settings.py to register hooks and framework settings.")
        if not (package_dir / "pipeline_registry.py").exists():
            findings.append("Missing pipeline_registry.py")
            recommendations.append("Add pipeline_registry.py with register_pipelines().")
        if pipelines_dir and not pipelines_dir.exists():
            findings.append("Missing pipelines directory")
            recommendations.append("Create src/<package_name>/pipelines and organise each modular pipeline in its own folder.")
        if pipelines_dir and pipelines_dir.exists() and not pipeline_folders:
            findings.append("No modular pipeline folders found")
            recommendations.append("Create pipeline folders such as data_processing, training, or inference.")

    if not tests_dir.exists():
        findings.append("Missing tests directory")
        recommendations.append("Add tests for node logic and critical pipeline wiring.")

    catalog_files = []
    parameter_files = []
    credential_files = []
    if conf_dir.exists():
        catalog_files = list_files(project_root, "conf/**/catalog*.y*ml")
        parameter_files = list_files(project_root, "conf/**/parameters*.y*ml")
        credential_files = list_files(project_root, "conf/**/credentials*.y*ml")

    if conf_dir.exists() and not catalog_files:
        findings.append("No catalog configuration files found")
        recommendations.append("Declare datasets in catalog.yml instead of hardcoding file I/O in Python.")

    if conf_dir.exists() and not parameter_files:
        findings.append("No parameter configuration files found")
        recommendations.append("Add parameters.yml or pipeline-specific parameter files for tuneable behavior.")

    report = {
        "project_root": str(project_root.resolve()),
        "is_likely_kedro_project": bool(kedro_meta or package_dir),
        "kedro_metadata": kedro_meta,
        "package_dir": str(package_dir) if package_dir else None,
        "present": {
            "pyproject.toml": (project_root / "pyproject.toml").exists(),
            "conf": conf_dir.exists(),
            "conf/base": base_dir.exists(),
            "conf/local": local_dir.exists(),
            "tests": tests_dir.exists(),
            "settings.py": bool(package_dir and (package_dir / "settings.py").exists()),
            "pipeline_registry.py": bool(package_dir and (package_dir / "pipeline_registry.py").exists()),
            "pipelines_dir": bool(pipelines_dir and pipelines_dir.exists()),
        },
        "pipeline_folders": pipeline_folders,
        "config_files": {
            "catalog": catalog_files,
            "parameters": parameter_files,
            "credentials": credential_files,
        },
        "findings": findings,
        "recommendations": recommendations,
    }
    return report


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python scripts/scan_kedro_project.py /path/to/project", file=sys.stderr)
        return 1

    project_root = Path(sys.argv[1]).expanduser().resolve()
    if not project_root.exists() or not project_root.is_dir():
        print(json.dumps({"error": f"Project path not found or not a directory: {project_root}"}, indent=2))
        return 1

    report = build_report(project_root)
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
